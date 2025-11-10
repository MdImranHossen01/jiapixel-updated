import ProjectWizard from "../../components/ProjectWizard";

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Create your service project following Upwork's step-by-step process
        </p>
      </div>

      <ProjectWizard/>
    </div>
  );
}