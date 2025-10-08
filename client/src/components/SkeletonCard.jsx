const SkeletonCard = () => {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="skeleton h-48 w-full mb-4 rounded-xl" />
      <div className="skeleton h-6 w-3/4 mb-2 rounded" />
      <div className="skeleton h-4 w-1/2 mb-4 rounded" />
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton h-10 w-full rounded-full" />
    </div>
  );
};

export default SkeletonCard;
