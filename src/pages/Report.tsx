import Header from "@/components/Header";
import ReportIncident from "@/components/ReportIncident";

const Report = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8">
        <ReportIncident />
      </main>
    </div>
  );
};

export default Report;