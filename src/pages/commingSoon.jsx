const ComingSoon = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6">
        <Icon className="w-16 h-16 text-gray-400 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-8">{description || `${title} functionality is coming soon`}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <p className="text-blue-700 text-sm">
          🚀 We're working hard to bring you this feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
