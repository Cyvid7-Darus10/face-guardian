import BasicModal from '@/components/Atom/BasicModal';
import Image from 'next/image';
import Link from 'next/link';

const Intro = () => {
  return (
    <BasicModal title="Intro" open={true}>
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="leading-[30px] text-[20px]">
          {`
						We're thrilled to have you join our community. To get started,
						please let our algorithm scan your face. This will make sure that
						you are a unique user before proceeding with the registration
						process. `}
        </p>
        <p className="leading-[30px] text-[20px]">
          {`
					Once you've completed the registration form, we'll send you
						a verification email to the email address you provided. Please click
						on the verification link in this email to confirm your account and
						complete the registration process.`}
        </p>
        <p className="leading-[30px] text-[20px]">
          {`
						After you've confirmed your
						account, you'll be able to access all of the features and
						functionality of Face Guardian.`}
        </p>
      </div>
    </BasicModal>
  );
};

export default Intro;
