type RepositoryCardProps = {
  repository: {
    id: string;
    githubUrl: string;
    status: string;
    createdAt: string | Date;
  };
};

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold">{repository.githubUrl}</h2>

      <p className="text-sm text-gray-500">Status: {repository.status}</p>

      <p className="text-xs text-gray-400">
        {new Date(repository.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
