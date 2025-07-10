import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  XMarkIcon,
  CubeIcon,
  GlobeAltIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import useUserDataStore from '@/store/userDataStore';
import { toast } from 'react-toastify';
import { Input } from '@/components/Atom';
import Button from '@/components/Atom/Button';
import { App } from '../index';

interface FormData {
  name: string;
  domain: string;
  redirectTo: string;
}

interface AppCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppCreated: (app: App) => void;
}

const AppCreationModal: React.FC<AppCreationModalProps> = ({
  isOpen,
  onClose,
  onAppCreated,
}) => {
  const supabaseClient = useSupabaseClient();
  const { userData } = useUserDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      domain: '',
      redirectTo: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async data => {
    if (!userData?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    try {
      const appData = {
        name: data.name,
        domain: data.domain,
        redirect_to: data.redirectTo,
        profile_id: userData.id,
      };

      const { data: createdApp, error } = await supabaseClient
        .from('apps')
        .insert([appData])
        .select()
        .single();

      if (error) {
        toast.error('Error creating application');
        console.error(error);
        return;
      }

      onAppCreated(createdApp);
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Failed to create application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CubeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Create New Application
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    id="name"
                    label="Application Name"
                    type="text"
                    {...register('name', {
                      required: 'Application name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    error={errors.name?.message}
                    placeholder="My Awesome App"
                    fullWidth
                  />

                  <Input
                    id="domain"
                    label="Domain"
                    type="text"
                    {...register('domain', {
                      required: 'Domain is required',
                    })}
                    error={errors.domain?.message}
                    placeholder="example.com"
                    fullWidth
                  />

                  <Input
                    id="redirectTo"
                    label="Redirect URL"
                    type="url"
                    {...register('redirectTo', {
                      required: 'Redirect URL is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message:
                          'Please enter a valid URL starting with http:// or https://',
                      },
                    })}
                    error={errors.redirectTo?.message}
                    placeholder="https://example.com/auth/callback"
                    fullWidth
                  />

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> After creating your application,
                      you&apos;ll receive a unique App ID and client credentials
                      that you can use to integrate with Face Guardian.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create Application'
                      )}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AppCreationModal;
