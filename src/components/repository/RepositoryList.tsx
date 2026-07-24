import RepositoryCard from "./RepositoryCard";

type Repository = {
  id: string;
  githubUrl: string;
  status: string;
  createdAt: Date;
};

type RepositoryListProps = {
  repositories: Repository[];
};

export default function RepositoryList({ repositories }: RepositoryListProps) {
  if (repositories.length === 0) {
    return <p className="text-gray-500">No repositories added yet.</p>;
  }

  return (
    <div className="space-y-4">
      {repositories.map((repository) => (
        <RepositoryCard key={repository.id} repository={repository} />
      ))}
    </div>
  );
}
