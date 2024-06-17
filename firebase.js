// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { limit,orderBy,query, where, getFirestore, collection, addDoc, getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDlCVJr4dXfL_kldpAQw_Y5tJgk4Fk3Ng",
  authDomain: "regiactapp-48209.firebaseapp.com",
  projectId: "regiactapp-48209",
  storageBucket: "regiactapp-48209.appspot.com",
  messagingSenderId: "452830201142",
  appId: "1:452830201142:web:af0d9c2aef1fa043979f97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()

export const signIn = (email,pass) => {
    signInWithEmailAndPassword(auth,email,pass)
    .catch((error) =>{
      alert(error.message)
    })
}

export const logout = () => {
  signOut(auth)
}

//controladores actividades

export const onGetActis = (callback) => onSnapshot(query(collection(db,'actividades'), orderBy("nombre", "asc")),callback)
                                            
export const guardarActi = (objActividad) => addDoc(collection(db, 'actividades'),objActividad)

//controladores registro de horas

export const registrarHora = (objRegistro) => addDoc(collection(db, 'registros'),objRegistro)

export const onGetRegistros = (callback) => onSnapshot(query(collection(db,'registros'), orderBy("fechaIni","desc")),callback)

export const onGetRegistrosUsuario = (callback) => onSnapshot(query(collection(db,'registros'), where("userEmail","==","ftoro@servipag.cl"), orderBy("modificado","desc")),callback)

export const getRegistroPorActividadId = (idActi) => getDoc(doc(db,'registros',idActi))

export const getRegistroId = (id) => getDoc(doc(db,'registros',id))

export const editarReg = (id, newFields) => updateDoc(doc(db,'registros',id),newFields)

export const deleteRegistro = id => deleteDoc(doc(db,'registros',id))



//controladores colaboradores

//export const saveUser = (nombre) => addDoc(collection(db, 'usuarios'),{nombre})
   
//export const getUsers = () => getDocs(collection(db,'usuarios'))

export const onGetUsers = (callback) => onSnapshot(collection(db,'usuarios'),callback)

//export const deleteUser = id => deleteDoc(doc(db,'usuarios',id))

export const getUser =  id => getDoc(doc(db,'usuarios',id))

//export const editUser = (id, newFields) => updateDoc(doc(db,'usuarios',id),newFields)

//controladores sesiones usuarios

export const signUp = (email,pass) => {
  createUserWithEmailAndPassword(auth,email,pass)
  .then(userCredentials => {
    console.log('signup')
  })
}