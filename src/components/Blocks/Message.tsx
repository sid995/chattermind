"use client";

export const Message = ({ message }: any) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        message.role === "system"
          ? "bg-blue-100"
          : message.role === "user"
          ? "bg-gray-100"
          : "bg-green-100"
      }`}
    >
      <div className="font-bold">
        {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
      </div>
      <div>{message.content}</div>
      {message.createdAt && (
        <div className="text-xs text-gray-500 mt-1">
          {new Date(message.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};
