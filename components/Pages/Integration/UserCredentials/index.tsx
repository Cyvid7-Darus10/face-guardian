import useUserDataStore from '@/store/userDataStore';
import HiddenInput from '@/components/Atom/HiddenInput';

const UserCredentials = () => {
  const { userData } = useUserDataStore();

  return (
    <div className="flex flex-row items-center w-full gap-5">
      <div className="flex flex-col w-full h-full gap-5">
        <div className="flex flex-col">
          <p className="w-fit">Secrent Key:</p>
          <HiddenInput content={userData?.clients?.secret_key} />
        </div>
      </div>
    </div>
  );
};

export default UserCredentials;
