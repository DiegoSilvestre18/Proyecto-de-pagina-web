import React, { useEffect, useState } from 'react';
import { ChangeUser, ChangePassword } from '../Services/SettingsService';
import { ListItems } from '../Components/ListItems';
import { useAuth } from '../../../../Context/AuthContext';
import { type FormData, type PasswordData } from '../Types/Types';

type PasswordFormWithConfirmation = PasswordData & {
  confirmPassword: string;
};

const buildUserForm = (user: ReturnType<typeof useAuth>['user']): FormData => ({
  username: user?.username ?? '',
  nombre: user?.nombre ?? '',
  apellidoPaterno: user?.apellidoPaterno ?? '',
  apellidoMaterno: user?.apellidoMaterno ?? '',
  telefono: user?.telefono ?? '',
  email: user?.email ?? '',
});

const initialPasswordForm: PasswordFormWithConfirmation = {
  passwordActual: '',
  passwordNueva: '',
  confirmPassword: '',
};

const AccountSettings: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [sections, setSections] = useState({
    info: true,
  });
  const [userForm, setUserForm] = useState<FormData>(() => buildUserForm(user));
  const [passwordForm, setPasswordForm] =
    useState<PasswordFormWithConfirmation>(initialPasswordForm);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    setUserForm(buildUserForm(user));
  }, [user]);

  const toggleSection = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveInfo = async () => {
    if (!userForm.username || !userForm.nombre || !userForm.email) {
      setInfoMessage('Username, nombre y email son obligatorios.');
      return;
    }

    setIsSavingInfo(true);
    setInfoMessage(null);
    try {
      await ChangeUser(userForm);
      updateUserProfile(userForm);
      setIsEditingInfo(false);
      setInfoMessage('Informacion actualizada correctamente.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la informacion.';
      setInfoMessage(errorMessage);
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleCancelInfo = () => {
    setUserForm(buildUserForm(user));
    setIsEditingInfo(false);
    setInfoMessage(null);
  };

  const handleSavePassword = async () => {
    if (!passwordForm.passwordActual || !passwordForm.passwordNueva) {
      setPasswordMessage(
        'Debes completar contrasena actual y nueva contrasena.',
      );
      return;
    }
    if (passwordForm.passwordNueva.length < 6) {
      setPasswordMessage(
        'La nueva contrasena debe tener al menos 6 caracteres.',
      );
      return;
    }
    if (passwordForm.passwordNueva !== passwordForm.confirmPassword) {
      setPasswordMessage(
        'La confirmacion no coincide con la nueva contrasena.',
      );
      return;
    }

    setIsSavingPassword(true);
    setPasswordMessage(null);
    try {
      await ChangePassword({
        passwordActual: passwordForm.passwordActual,
        passwordNueva: passwordForm.passwordNueva,
      });
      setPasswordForm(initialPasswordForm);
      setIsEditingPassword(false);
      setPasswordMessage('Contrasena actualizada correctamente.');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la contrasena.';
      setPasswordMessage(errorMessage);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordForm(initialPasswordForm);
    setIsEditingPassword(false);
    setPasswordMessage(null);
  };

  return (
    <>
      <h2 className="text-2xl font-black text-white mb-8 tracking-wide">
        Cuenta
      </h2>
      <ListItems
        info="Información de la cuenta"
        toggleSection={() => toggleSection('info')}
        sections={sections.info}
        userForm={userForm}
        passwordForm={passwordForm}
        isEditingInfo={isEditingInfo}
        isSavingInfo={isSavingInfo}
        isEditingPassword={isEditingPassword}
        isSavingPassword={isSavingPassword}
        infoMessage={infoMessage}
        passwordMessage={passwordMessage}
        onUserChange={handleUserChange}
        onPasswordChange={handlePasswordChange}
        onStartEditInfo={() => {
          setInfoMessage(null);
          setIsEditingInfo(true);
        }}
        onCancelEditInfo={handleCancelInfo}
        onSaveInfo={handleSaveInfo}
        onStartEditPassword={() => {
          setPasswordMessage(null);
          setIsEditingPassword(true);
        }}
        onCancelEditPassword={handleCancelPassword}
        onSavePassword={handleSavePassword}
      />
    </>
  );
};

// "usuario": {
//   "id": 3,
//   "username": "anuel",
//   "nombre": "caquin",
//   "apellidoPaterno": "gaelito",
//   "apellidoMaterno": "anuiel",
//   "telefono": "933933933",
//   "email": "realanuel@gmail.com",
//   "rol": "USER",
//   "saldoReal": 0.00,
//   "saldoBono": 0.00
// }

export default AccountSettings;
