import ProjectForm from "../components/ProjectForm";

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">
          Set up your service project for Jia Pixel clients
        </p>
      </div>

      <ProjectForm/>
    </div>
  );
}