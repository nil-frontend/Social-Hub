import { SubNavFrosted } from "@/components/layout/sub-nav-frosted";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UploadWizard } from "@/components/upload/upload-wizard";
import { getConnectedChannels } from "@/app/actions/channels";

export default async function UploadPage() {
  const channels = await getConnectedChannels();

  return (
    <>
      <SubNavFrosted
        title="Distribute Video"
        subtitle="Multi-Channel Publisher"
      />

      <DashboardLayout>
        <UploadWizard channels={channels} />
      </DashboardLayout>
    </>
  );
}
