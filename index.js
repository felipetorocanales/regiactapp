import {guardarActi,onGetRegistros,registrarHora,auth,logout,signIn,onGetActis, getRegistroId,editarReg,deleteRegistro,onGetUsers} from './firebase.js'
import {cantidadHoras} from './functions.js'

//llamadas a elementos html
const spanEmail = document.getElementById('email')
const selectActividad = document.getElementById('selectActividad')
const selectEtapa = document.getElementById('selectEtapa')
const inputFechaIni = document.getElementById('fechaIni')
const inputFechaFin = document.getElementById('fechaFin')
const inputHoras = document.getElementById('inputHoras')
const loggedInLinks = document.querySelectorAll('.login')
const loggedOutLinks = document.querySelectorAll('.logout')
const listaRegistros = document.getElementById('listaRegistros')
const mensajeAlerta = document.getElementById('mensajeAlerta')
const alertaFechas = document.getElementById('alertaFechas')
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const adminLinks = document.querySelectorAll('.admin')
const tablaRegistros = document.getElementById('tablaRegistros')

const btnsEditReg = document.querySelector('.btns-edit-reg')
const btnsSaveReg = document.querySelector('.btns-save-reg')

const btnVerTodoReg = document.getElementById('btnVerTodoReg')
const btnDescargarData = document.getElementById('btnDescargarData')

//variables globales
let userEmail = ''
let userRol = ''
let idRegistro = ''
let nombresActividades = []

auth.onAuthStateChanged(async (user) => {
    if(user){
        adminLinks.forEach(link => link.style.display = 'none')
        loggedOutLinks.forEach(link => link.style.display = 'none')
        loggedInLinks.forEach(link => link.style.display = 'block')
        spanEmail.innerHTML = user.email
        userEmail = user.email
        onGetUsers((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                if(doc.data().key == userEmail){
                    userRol = doc.data().rol
                    if(userRol == 'admin'){
                        adminLinks.forEach(link => link.style.display = 'block')
                    }
                }
            })
        })

        //poblarSelectActividades()
        poblarTablaRegistrosPorMail(userEmail)
    }else{
        loggedOutLinks.forEach(link => link.style.display = 'block')
        loggedInLinks.forEach(link => link.style.display = 'none')
    }
})

signinForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signinForm['signin-email'].value
    const pass = signinForm['signin-pass'].value

    signIn(email,pass)
    signinForm.reset()
})

cambiarContForm.addEventListener('submit', (e) => {
    e.preventDefault()

})

btnVerTodoReg.addEventListener('click',(e) => {
    e.preventDefault()
    poblarTablaRegistros()
})

btnDescargarData.addEventListener('click',(e) =>{
    e.preventDefault()
    exportCSVExcel()
})

btnLogout.addEventListener('click', (e) =>{
    e.preventDefault()
    logout()
})

window.addEventListener('DOMContentLoaded', async() => {
    if(listaRegistros.innerHTML == ''){
        poblarTablaRegistrosPorMail(userEmail)
    }
    
})

function poblarTablaRegistrosPorMail(mail){
    if(mail){
        onGetRegistros((querySnapshot) => {
            
            listaRegistros.innerHTML = ''
            const etapas = ["General","Planificación","Ejecución","Comunicación","Revisión de calidad QA"]
            querySnapshot.forEach(async (doc) => {
                if(doc.data().userEmail == mail){
                    const registro = doc.data()
                    
                    listaRegistros.innerHTML += `
                        <tr>
                            <td>${registro.fechaIni.substring(0,10)}</td>
                            <td>${registro.fechaIni.substring(11)}</td>
                            <td>${registro.fechaFin.substring(0,10)}</td>
                            <td>${registro.fechaFin.substring(11)}</td>
                            <td>${registro.actividad}</td>
                            <td>${registro.userEmail}</td>
                            <td>${registro.horas}</td>
                            <td>${etapas[registro.etapa]}</td>
                            <td class="no-export"><button class="btn btn-primary btn-editarReg" data-id="${doc.id}">Editar/Copiar</button>
                            <button class="btn btn-danger btn-deleteReg" data-id="${doc.id}">Eliminar</button></td>   
                        </tr>
                    `
                } 
            })

            const btnsEditar = listaRegistros.querySelectorAll('.btn-editarReg')

            btnsEditar.forEach(btn => {
                poblarSelectActividades()
                btn.addEventListener('click', async({target: {dataset}}) => {
                    const registro = await getRegistroId(dataset.id)
                    
                    poblarSelectTipoRegistro(registro.data().etapa)
                    btnsEditReg.style.display = 'inline'
                    //btnsSaveReg.style.display = 'none'
                    selectActividad.value = registro.data().actividad
                    selectEtapa.value = registro.data().etapa
                    inputFechaIni.value = registro.data().fechaIni
                    inputFechaFin.value = registro.data().fechaFin
                    inputHoras.value = registro.data().horas
                    
                    idRegistro = registro.id
                    scrollTop()
                })
            })

            const btnsEliminar = listaRegistros.querySelectorAll('.btn-deleteReg')

            btnsEliminar.forEach(btn => {
                btn.addEventListener('click', async({target: {dataset}}) => {
                    if(deleteRegistro(dataset.id)){
                         alert("Registro eliminado","danger")
                    }
                })
            })
        })
    }
}

function poblarTablaRegistros(){
    onGetRegistros((querySnapshot) => {
        
        listaRegistros.innerHTML = ''
        const etapas = ["General","Planificación","Ejecución","Comunicación","Revisión de calidad QA"]
        querySnapshot.forEach(async (doc) => {
            const registro = doc.data()
            
            listaRegistros.innerHTML += `
                <tr>
                    <td>${registro.fechaIni.substring(0,10)}</td>
                    <td>${registro.fechaIni.substring(11)}</td>
                    <td>${registro.fechaFin.substring(0,10)}</td>
                    <td>${registro.fechaFin.substring(11)}</td>
                    <td>${registro.actividad}</td>
                    <td>${registro.userEmail}</td>
                    <td>${registro.horas}</td>
                    <td>${etapas[registro.etapa]}</td>
                    <td class="no-export"><button class="btn btn-primary btn-editarReg" data-id="${doc.id}">Editar/Copiar</button>
                    <button class="btn btn-danger btn-deleteReg" data-id="${doc.id}">Eliminar</button></td>   
                </tr>
            `
        })

        const btnsEditar = listaRegistros.querySelectorAll('.btn-editarReg')

        btnsEditar.forEach(btn => {
            poblarSelectActividades()
            btn.addEventListener('click', async({target: {dataset}}) => {
                const registro = await getRegistroId(dataset.id)
                
                poblarSelectTipoRegistro(registro.data().etapa)
                btnsEditReg.style.display = 'inline'
                //btnsSaveReg.style.display = 'none'
                selectActividad.value = registro.data().actividad
                selectEtapa.value = registro.data().etapa
                inputFechaIni.value = registro.data().fechaIni
                inputFechaFin.value = registro.data().fechaFin
                inputHoras.value = registro.data().horas

                idRegistro = registro.id
                scrollTop()
            })
        })

        const btnsEliminar = listaRegistros.querySelectorAll('.btn-deleteReg')

        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', async({target: {dataset}}) => {
                if(deleteRegistro(dataset.id)){
                        alert("Registro eliminado","danger")
                }
            })
        })
    })
}

function poblarSelectActividades(){
    onGetActis((querySnapshot) => {
        selectActividad.innerHTML = '<option class="link-selected-acti" value="nada">...</option>'
        querySnapshot.forEach(async (doc) => {
            const actividad = doc.data()
            const dominioUsuario = userEmail.substring(userEmail.indexOf('@'),userEmail.length );
            const dominioActividad = actividad.userEmail.substring(actividad.userEmail.indexOf('@'),actividad.userEmail.length );
            if(actividad.estado === true){
                if(dominioActividad === dominioUsuario){
                    selectActividad.innerHTML += `
                        <option class="link-selected-acti" value="${actividad.nombre}" data-id="${actividad.tipo}">${actividad.nombre}</option>
                    `
                    nombresActividades.push(actividad.nombre)
                }
            }
        })
    })
}

function poblarSelectTipoRegistro(etapa){
    if (etapa >= 1 && etapa <= 4){
        selectEtapa.innerHTML = ""
        selectEtapa.innerHTML += `
            <option value="1">Planificación</option>
            <option value="2">Ejecución</option>
            <option value="3">Comunicación</option>
            <option value="4">Revisión de calidad QA</option>
        `
    }else if(etapa == 0){
        selectEtapa.innerHTML = ""
        selectEtapa.innerHTML += `
            <option value="0">General</option>
        `
    }
}

selectActividad.addEventListener('click',(e) => {
    if(e.target.value == "0"){
        poblarSelectActividades()
    }
})

selectActividad.addEventListener('change',(e)=> {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const tipoAct = selectedOption.dataset.id
    if (tipoAct == "auditoria"){
        selectEtapa.innerHTML = ""
        selectEtapa.innerHTML += `
            <option value="1">Planificación</option>
            <option value="2">Ejecución</option>
            <option value="3">Comunicación</option>
            <option value="4">Revisión de calidad QA</option>
        `
    }else if(tipoAct == "general"){
        selectEtapa.innerHTML = ""
        selectEtapa.innerHTML += `
            <option value="0">General</option>
        `
    }else{
        selectEtapa.innerHTML = ""
    }
})

regHorasForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const actividad = regHorasForm['selectActividad'].value
    const fechaIni = regHorasForm['fechaIni'].value
    const fechaFin = regHorasForm['fechaFin'].value
    const horas = regHorasForm['inputHoras'].value
    const etapa = regHorasForm['selectEtapa'].value
    const dateTime = new Date()

    if(etapa != "" && actividad != "nada"){
        if(new Date(regHorasForm['fechaIni'].value) <= new Date(regHorasForm['fechaFin'].value )){
            if(fechaIni.substring(0,10) == fechaFin.substring(0,10)){
                if(e.submitter.id == "btn-save-reg"){
                    registrarHora({fechaIni,fechaFin,horas,actividad,userEmail,etapa,creado:dateTime,modificado:dateTime})
                    alert('Registro ingresado!', 'success')
                    btnsEditReg.style.display = 'none'
                }else if(e.submitter.id == "btn-edit-reg"){
                    editarReg(idRegistro,{fechaIni,fechaFin,horas,actividad,userEmail,etapa,modificado:dateTime})
                    alert('Registro modificado!', 'primary')
                    btnsEditReg.style.display = 'none'
                }else if(e.submitter.id == "btn-cancel-edit-reg"){
                    btnsEditReg.style.display = 'none'
                }
                regHorasForm.reset()
            }else{
                mensajeAlerta.innerHTML = `
                <strong>Error!</strong> Fecha inicio no puede ser distinta que fecha final
                `
                alertaFechas.className = "alert alert-warning alert-dismissible fade show"
                alertaFechas.style.display = 'block'
            }
        }else{
            mensajeAlerta.innerHTML = `
            <strong>Error!</strong> Fecha y hora de inicio no puede ser menor que fecha y hora final
            `
            alertaFechas.className = "alert alert-warning alert-dismissible fade show"
            alertaFechas.style.display = 'block'
        }
    }else{
        mensajeAlerta.innerHTML = `
            <strong>Error!</strong> Debe seleccionar una actividad
            `
            alertaFechas.className = "alert alert-warning alert-dismissible fade show"
            alertaFechas.style.display = 'block'
    }
})

actiForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nombre = actiForm['nombreAct'].value
    const horas = actiForm['horasTotales'].value
    const tipo = actiForm['tipoActividad'].value

    if(tipo != 'Seleccione tipo'){
        let existe = nombresActividades.map(function(x){
            if(quitarAcentos(x.toLowerCase()) == quitarAcentos(nombre.toLowerCase())){
                return 1
            }
        })
        if(existe.includes(1)){
            alert("La actividad que intenta ingresar ya existe en la base de datos","danger")
        }else{
            guardarActi({nombre,horas,estado:true,tipo,userEmail})
            alert("Actividad agregada","success")
        }
    }else{
        $('#faltaTipoAlerta').show()
    }

})

regHorasForm['fechaFin'].addEventListener('change',(e) =>{
    regHorasForm['inputHoras'].value = cantidadHoras(new Date(regHorasForm['fechaIni'].value), new Date(regHorasForm['fechaFin'].value))
})
regHorasForm['fechaIni'].addEventListener('change',(e) =>{
    regHorasForm['inputHoras'].value = cantidadHoras(new Date(regHorasForm['fechaIni'].value), new Date(regHorasForm['fechaFin'].value))
})

const scrollTop = function (){
    if (window.scrollY != 0) {
        setTimeout(function () {
          window.scrollTo(0, 0);
        }, 10);
      }
}

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)

    setTimeout(function saludos(){
        wrapper.innerHTML = ''
    }, 3000);
  }

function exportCSVExcel() {
	$('#tablaRegistros').table2excel({
		exclude: ".no-export",
		filename: "download.xls",
		fileext: ".xls",
		exclude_links: true,
		exclude_inputs: true
	});
}

function quitarAcentos(cadena){
	const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
	return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

 

// const actiForm = document.getElementById('form-actividad')
// const actiLista = document.getElementById('lista-actividades')

// const regHorasForm = document.getElementById('regHorasForm')
// const navTabHeader = document.getElementById('v-pills-tab')
// const navTabContent = document.getElementById('v-pills-tabContent')

// const dropdownActividades = document.getElementById('dropdownActividades')
// const usrForm = document.getElementById('form-usuario')
// const usrLista = document.getElementById('lista-usuarios')
// let editStatus = false
// let idActi = ''
// let userId = ''
// let selectedActi = ''








// // usrForm.addEventListener('submit', (e) => {
// //     e.preventDefault()

// //     const nombre = usrForm['nombreUsr'].value

// //     saveUser(nombre)

// //     usrForm.reset()
// // })

// //signupForm.addEventListener('submit', (e) => {
//   //  e.preventDefault()

//     //const email = signupForm['signup-email'].value
//     //const pass = signupForm['signup-pass'].value

// //    signUp(email,pass)
//   //  $('#signupModal').modal('hide')
//    // signupForm.reset()
// //})








    // onGetUsers((querySnapshot) => {
    //     usrLista.innerHTML = ''
    //     querySnapshot.forEach(doc => {
    //         const usuario = doc.data()
            
    //         usrLista.innerHTML += `
    //         <div class="card card-body mt-2 border-primary">
    //             <h3 class="h5">${usuario.nombre}</h3>
    //             <div>
    //                 <button class="btn btn-primary btn-eliminarUsr" data-id="${doc.id}">Eliminar</button>
    //                 <button class="btn btn-secondary btn-editarUsr" data-id="${doc.id}">Editar</button>
    //             </div>
    //         </div>
    //         `
    //     })

    //     const btnsEliminar = usrLista.querySelectorAll('.btn-eliminarUsr')

    //     btnsEliminar.forEach(btn => {
    //         btn.addEventListener('click', ({target: {dataset}}) => {
    //             deleteUser(dataset.id)
    //         })
    //     })
    // })