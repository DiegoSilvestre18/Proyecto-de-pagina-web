import React, { useState } from 'react';
import { ListItems } from '../Components/ListItems';
import { useAuth } from '../../../../Context/AuthContext';

const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState({
    info: true,
    saldos: true,
    seguridad: true,
    personal: false,
  });
  const toggleSection = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
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
