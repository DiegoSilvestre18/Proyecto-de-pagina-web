import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { type FormData, type PasswordData } from '../Types/Types';

type PasswordFormWithConfirmation = PasswordData & {
  confirmPassword: string;
};

interface ListItemsProps {
  info: string;
  toggleSection: () => void;
  sections: boolean;
  userForm: FormData;
  passwordForm: PasswordFormWithConfirmation;
  isEditingInfo: boolean;
  isSavingInfo: boolean;
  isEditingPassword: boolean;
  isSavingPassword: boolean;
  infoMessage: string | null;
  passwordMessage: string | null;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartEditInfo: () => void;
  onCancelEditInfo: () => void;
  onSaveInfo: () => void;
  onStartEditPassword: () => void;
  onCancelEditPassword: () => void;
  onSavePassword: () => void;
}

export const ListItems: React.FC<ListItemsProps> = ({
  info,
  toggleSection,
  sections,
  userForm,
  passwordForm,
  isEditingInfo,
  isSavingInfo,
  isEditingPassword,
  isSavingPassword,
  infoMessage,
  passwordMessage,
  onUserChange,
  onPasswordChange,
  onStartEditInfo,
  onCancelEditInfo,
  onSaveInfo,
  onStartEditPassword,
  onCancelEditPassword,
  onSavePassword,
}) => {
  const inputClassName =
    'w-full bg-[#0d0f1f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40';

  const renderUserField = (
    label: string,
    name: keyof FormData,
    type: React.HTMLInputTypeAttribute = 'text',
  ) => (
    <div className="flex items-center justify-between gap-4">
      <div className="w-full">
        <p className="font-bold text-white mb-1">{label}</p>
        {isEditingInfo ? (
          <input
            type={type}
            name={name}
            value={userForm[name]}
            onChange={onUserChange}
            className={inputClassName}
          />
        ) : (
          <p className="text-sm text-gray-400">{userForm[name] || '-'}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-2">
        <button
          onClick={toggleSection}
          className="w-full flex justify-between items-center py-4 text-left group"
        >
          <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
            {info}
          </h3>
          {sections ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>

        {sections && (
          <div className="space-y-6 pb-6 animate-in slide-in-from-top-2">
            {renderUserField('Username', 'username')}
            <div className="h-px w-full bg-white/5"></div>
            {renderUserField('Nombre', 'nombre')}
            <div className="h-px w-full bg-white/5"></div>
            {renderUserField('Apellido Paterno', 'apellidoPaterno')}
            <div className="h-px w-full bg-white/5"></div>
            {renderUserField('Apellido Materno', 'apellidoMaterno')}
            <div className="h-px w-full bg-white/5"></div>
            {renderUserField('Telefono', 'telefono', 'tel')}
            <div className="h-px w-full bg-white/5"></div>
            {renderUserField('Email', 'email', 'email')}

            <div className="flex items-center justify-end gap-3 pt-2">
              {isEditingInfo ? (
                <>
                  <button
                    type="button"
                    onClick={onCancelEditInfo}
                    disabled={isSavingInfo}
                    className="text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onSaveInfo}
                    disabled={isSavingInfo}
                    className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {isSavingInfo ? 'Guardando...' : 'Guardar'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onStartEditInfo}
                  className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Editar informacion
                </button>
              )}
            </div>

            {infoMessage && (
              <p className="text-xs text-orange-400 text-right -mt-3">
                {infoMessage}
              </p>
            )}

            <div className="h-px w-full bg-white/5"></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white mb-1">Contrasena</p>
                  <p className="text-sm text-gray-400">••••••••</p>
                </div>
                {!isEditingPassword && (
                  <button
                    type="button"
                    onClick={onStartEditPassword}
                    className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditingPassword && (
                <div className="space-y-3">
                  <input
                    type="password"
                    name="passwordActual"
                    placeholder="Contrasena actual"
                    value={passwordForm.passwordActual}
                    onChange={onPasswordChange}
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="passwordNueva"
                    placeholder="Nueva contrasena"
                    value={passwordForm.passwordNueva}
                    onChange={onPasswordChange}
                    className={inputClassName}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar nueva contrasena"
                    value={passwordForm.confirmPassword}
                    onChange={onPasswordChange}
                    className={inputClassName}
                  />

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onCancelEditPassword}
                      disabled={isSavingPassword}
                      className="text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={onSavePassword}
                      disabled={isSavingPassword}
                      className="text-orange-500 hover:text-orange-400 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isSavingPassword ? 'Guardando...' : 'Guardar contrasena'}
                    </button>
                  </div>
                </div>
              )}

              {passwordMessage && (
                <p className="text-xs text-orange-400 text-right">
                  {passwordMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
