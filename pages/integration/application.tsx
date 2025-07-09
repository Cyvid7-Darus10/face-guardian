import HomeLayout from '@/components/Layout/HomeLayout';
import IntegrationLayout from '@/components/Layout/IntegrationLayout';
import AppList from '@/components/Pages/Integration/AppList';

const Integration = () => {
  return (
    <HomeLayout title="Home" restrict={true}>
      <IntegrationLayout pageTitle="Application">
        <AppList />
      </IntegrationLayout>
    </HomeLayout>
  );
};

export default Integration;
