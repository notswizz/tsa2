import OpenAI from 'openai';
import { searchStaff as searchStaffDb, getStaffMember as getStaffMemberDb, updateStaffMember as updateStaffMemberDb } from '@/utils/staff';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define available functions for the AI
const AVAILABLE_FUNCTIONS = {
  searchStaff: {
    name: 'searchStaff',
    description: 'Search for staff members based on criteria. Use this first to find a staff member before updating.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for name, email, or location',
        },
        location: {
          type: 'string',
          description: 'Filter by location (ATL, NYC, LA, DAL)',
        },
        department: {
          type: 'string',
          description: 'Filter by department',
        },
      },
      required: ['query'],
    },
  },
  getStaffMember: {
    name: 'getStaffMember',
    description: 'Get information about a specific staff member. Use this to get a staff member\'s details before updating.',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the staff member',
        },
        email: {
          type: 'string',
          description: 'The email of the staff member',
        },
      },
      required: ['name'],
    },
  },
  updateStaffMember: {
    name: 'updateStaffMember',
    description: 'Update information for a specific staff member. The ID must be obtained from a previous searchStaff or getStaffMember call.',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The MongoDB ObjectId of the staff member (24-character hexadecimal string). Must be obtained from a previous searchStaff or getStaffMember call.',
          pattern: '^[0-9a-fA-F]{24}$'
        },
        updates: {
          type: 'object',
          description: 'The fields to update',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'array', items: { type: 'string' } },
            role: { type: 'string' },
            department: { type: 'string' },
          },
        },
      },
      required: ['id', 'updates'],
    },
  },
};

// Function handlers
async function handleFunctionCall(functionCall) {
  const { name, arguments: args } = functionCall;
  const parsedArgs = JSON.parse(args);

  try {
    switch (name) {
      case 'searchStaff':
        const searchResult = await searchStaffDb(parsedArgs);
        if (!searchResult.success) {
          throw new Error(searchResult.error);
        }
        return searchResult;

      case 'getStaffMember':
        const staffResult = await getStaffMemberDb(parsedArgs);
        if (!staffResult.success) {
          throw new Error(staffResult.error);
        }
        return staffResult;

      case 'updateStaffMember':
        // Validate ObjectId format
        if (!/^[0-9a-fA-F]{24}$/.test(parsedArgs.id)) {
          throw new Error('Invalid staff member ID format. The ID must be obtained from a previous searchStaff or getStaffMember call.');
        }
        const updateResult = await updateStaffMemberDb(parsedArgs.id, parsedArgs.updates);
        if (!updateResult.success) {
          throw new Error(updateResult.error);
        }
        return updateResult;

      default:
        throw new Error(`Unknown function: ${name}`);
    }
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    return { error: `Failed to execute ${name}: ${error.message}` };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for The Smith Agency CRM system. You can help users manage staff data, search for information, and perform various CRM operations. When updating staff members: 1) First use getStaffMember to get their details and MongoDB ObjectId, 2) Then use that ObjectId to call updateStaffMember with the updates. Be concise and professional in your responses."
        },
        ...messages
      ],
      functions: Object.values(AVAILABLE_FUNCTIONS),
      function_call: "auto",
    });

    const aiResponse = completion.choices[0].message;

    // If the AI wants to call a function
    if (aiResponse.function_call) {
      const functionResult = await handleFunctionCall(aiResponse.function_call);
      
      // Get AI to summarize the function result
      const followUpCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...messages,
          aiResponse,
          {
            role: "function",
            name: aiResponse.function_call.name,
            content: JSON.stringify(functionResult),
          },
        ],
      });

      return res.status(200).json({
        content: followUpCompletion.choices[0].message.content,
      });
    }

    return res.status(200).json({
      content: aiResponse.content,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
} 