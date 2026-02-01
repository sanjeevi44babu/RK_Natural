import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Patient, Appointment, Room, Block, Bed, HealthRecord } from '@/types';
import { 
  mockUsers, mockPatients, mockAppointments, mockRooms, 
  mockBlocks, mockBeds, mockHealthRecords 
} from '@/data/mockData';

interface DataContextType {
  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  approveUser: (id: string) => void;
  
  // Patients
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  dischargePatient: (id: string) => void;
  assignRoom: (patientId: string, roomId: string, bedId: string) => void;
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  
  // Rooms & Beds
  rooms: Room[];
  blocks: Block[];
  beds: Bed[];
  updateBed: (id: string, updates: Partial<Bed>) => void;
  
  // Health Records
  healthRecords: HealthRecord[];
  addHealthRecord: (record: HealthRecord) => void;
  
  // Helpers
  getAvailableBeds: () => Bed[];
  getPatientById: (id: string) => Patient | undefined;
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [blocks] = useState<Block[]>(mockBlocks);
  const [beds, setBeds] = useState<Bed[]>(mockBeds);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);

  // User functions
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  
  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };
  
  const approveUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isApproved: true } : u));
  };

  // Patient functions
  const addPatient = (patient: Patient) => setPatients(prev => [...prev, patient]);
  
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  
  const dischargePatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient?.bedNumber && patient?.roomId) {
      setBeds(prev => prev.map(b => 
        b.patientId === id ? { ...b, isOccupied: false, patientId: undefined, patientName: undefined } : b
      ));
    }
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'discharged', dischargeDate: new Date().toISOString().split('T')[0], roomId: undefined, bedNumber: undefined } : p
    ));
  };
  
  const assignRoom = (patientId: string, roomId: string, bedId: string) => {
    const room = rooms.find(r => r.id === roomId);
    const bed = beds.find(b => b.id === bedId);
    const patient = patients.find(p => p.id === patientId);
    
    if (room && bed && patient) {
      setBeds(prev => prev.map(b => 
        b.id === bedId ? { ...b, isOccupied: true, patientId, patientName: patient.fullName } : b
      ));
      setPatients(prev => prev.map(p => 
        p.id === patientId ? { 
          ...p, 
          roomId, 
          roomNumber: room.roomNumber, 
          blockName: room.blockName, 
          bedNumber: bed.bedNumber,
          status: 'admitted',
          admissionDate: new Date().toISOString().split('T')[0]
        } : p
      ));
    }
  };

  // Appointment functions
  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };
  
  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  // Bed functions
  const updateBed = (id: string, updates: Partial<Bed>) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  // Health Record functions
  const addHealthRecord = (record: HealthRecord) => {
    setHealthRecords(prev => [...prev, record]);
  };

  // Helper functions
  const getAvailableBeds = () => beds.filter(bed => !bed.isOccupied);
  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <DataContext.Provider value={{
      users, addUser, updateUser, approveUser,
      patients, addPatient, updatePatient, dischargePatient, assignRoom,
      appointments, addAppointment, updateAppointment,
      rooms, blocks, beds, updateBed,
      healthRecords, addHealthRecord,
      getAvailableBeds, getPatientById, getUserById,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
