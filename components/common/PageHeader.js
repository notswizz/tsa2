export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>
      {action}
    </div>
  );
} 