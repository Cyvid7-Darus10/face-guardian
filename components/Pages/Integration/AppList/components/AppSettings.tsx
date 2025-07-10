import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Form, Input } from '@/components/Atom';
import Button from '@/components/Atom/Button';
import ConfirmationModal from '@/components/Atom/ConfirmationModal';
import { App } from '@/types';

interface FormData {
  name: string;
  domain: string;
  redirectTo: string;
}

interface AppSettingsProps {
  app: App;
  onAppUpdated: (app: App) => void;
  onAppDeleted: (appId: string) => void;
}

const AppSettings: React.FC<AppSettingsProps> = ({
  app,
  onAppUpdated,
  onAppDeleted,
}) => {
  const supabaseClient = useSupabaseClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: app.name || '',
      domain: app.domain || '',
      redirectTo: app.redirect_to || '',
    },
  });

  useEffect(() => {
    // Reset form when app data changes
    reset({
      name: app.name || '',
      domain: app.domain || '',
      redirectTo: app.redirect_to || '',
    });
  }, [app.id, app.name, app.domain, app.redirect_to, reset]);

  const onSubmit: SubmitHandler<FormData> = async data => {
    setIsUpdating(true);
    try {
      const { data: updatedApp, error } = await supabaseClient
        .from('apps')
        .update({
          name: data.name,
          domain: data.domain,
          redirect_to: data.redirectTo,
        })
        .eq('id', app.id)
        .select()
        .single();

      if (error) {
        toast.error('Error updating application');
        console.error(error);
        return;
      }

      onAppUpdated(updatedApp);
      toast.success('Application updated successfully');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabaseClient
        .from('apps')
        .delete()
        .eq('id', app.id);

      if (error) {
        toast.error('Error deleting application');
        console.error(error);
        return;
      }

      onAppDeleted(app.id);
      toast.success('Application deleted successfully');
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Application Settings
        </h3>
        <p className="text-gray-600">
          Update your application configuration details below.
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{
            required: 'Application name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <Input
              id="name"
              label="Application Name"
              type="text"
              {...field}
              error={errors.name?.message}
              placeholder="Enter application name"
              fullWidth
            />
          )}
        />

        <Controller
          name="domain"
          control={control}
          rules={{
            required: 'Domain is required',
          }}
          render={({ field }) => (
            <Input
              id="domain"
              label="Domain"
              type="text"
              {...field}
              error={errors.domain?.message}
              placeholder="example.com"
              fullWidth
            />
          )}
        />

        <Controller
          name="redirectTo"
          control={control}
          rules={{
            required: 'Redirect URL is required',
            pattern: {
              value: /^https?:\/\/.+/,
              message:
                'Please enter a valid URL starting with http:// or https://',
            },
          }}
          render={({ field }) => (
            <Input
              id="redirectTo"
              label="Redirect URL"
              type="url"
              {...field}
              error={errors.redirectTo?.message}
              placeholder="https://example.com/auth/callback"
              fullWidth
            />
          )}
        />

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            variant="outline"
            size="md"
            disabled={isDeleting}
            className="border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-500"
          >
            {isDeleting ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Application
              </>
            )}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isDirty || isUpdating}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isUpdating ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </Form>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone and will permanently remove all associated data."
        confirmText="Delete Application"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AppSettings;
