import ServiceWizard from "../../components/ServiceWizard";

export default function CreateServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Service</h1>
       
      </div>

      <ServiceWizard/>
    </div>
  );
}