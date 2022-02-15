const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4 } = require('uuid');

const json_huespedes = fs.readFileSync('src/huespedes.json', 'utf-8');
let huespedes = JSON.parse(json_huespedes);

const json_habitaciones = fs.readFileSync('src/habitaciones.json', 'utf-8');
let habitaciones = JSON.parse(json_habitaciones);

router.get('/', (req, res) => {
  res.json('Bienvenido, ingrese datos');
});

router.get('/huespedes', (req, res) => {
  res.json({ huespedes });
});

router.post('/nuevoUsuario', function (req, res) {
  try {
    let { nombre, edad, sexo, telefono, direccion } = req.body;

    console.log(req.body)
    if ( !nombre || !edad || !sexo || !telefono || !direccion) {
      res.status(400).send("Llenar todos los campos")
    }
    
    let nuevoUsuario = {
      id: v4(),
      nombre,
      edad,
      sexo,
      telefono,
      direccion
    }

    function validacion(usuario) {
      let object = {id: usuario.id}
      if (/^[a-zA-Z ,.'-]+$/i.test(usuario.nombre)) {
        object.nombre = usuario.nombre
      } else {res.status(400).send('Nombre inválido')}

      if (isNaN(usuario.edad) === false) { 
        object.edad = usuario.edad 
      } else {res.status(400).send('La edad no es valida')}

      if (usuario.sexo.toLowerCase() == "masculino" || usuario.sexo.toLowerCase() == "femenino") { 
        object.sexo = usuario.sexo 
      } else {res.status(400).send('Sexo invalido')}

      if (isNaN(usuario.telefono) === false) { 
        object.telefono = usuario.telefono 
      } else {res.status(400).send('Número de teléfono invalido')}

      if (/^[A-Za-z0-9'\.\-\s\,]+$/g.test(usuario.direccion)) { 
        object.direccion = usuario.direccion
        huespedes.push(object)
        return true
      } else {res.status(400).send('La direccion es invalida')}
        
    }

    if (validacion(nuevoUsuario)) {
      let json_huespedes = JSON.stringify(huespedes)
      fs.writeFileSync('src/huespedes.json', json_huespedes, 'utf-8')
      res.status(200).send("Huesped agregado")
    }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

router.post('/nuevoUsuario/:id/:habitacion', (req, res) => {
  try {
    let id = req.params.id
    let habitacion = req.params.habitacion

    if (id) {
      huespedes.forEach(usuario => {
        if(usuario.id == id) {
          let nuevoHuesped = {id}
          for (let cuarto in habitaciones) {
            if(cuarto == habitacion){
              habitaciones[cuarto].push(nuevoHuesped)
              let json_habitaciones = JSON.stringify(habitaciones)
              fs.writeFileSync('src/habitaciones.json', json_habitaciones, 'utf-8')
              res.status(200).send("Nuevo huesped registrado en la habitacion")
            }
          }
          res.status(400).send('Habitacion no es valida')
        }
      });   
    } else {
      res.status(400).send("Id no es valido")
    }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

router.put('/huespedes/modificar/:id', (req, res) => {
  try {
    let id = req.params.id
    if (id) { 
      let {nombre, edad, sexo, telefono, direccion} = req.body;
      
      let modificarUsuario = {
        nombre,
        edad,
        sexo,
        telefono,
        direccion
      }

      huespedes.forEach(usuario => {
        if (usuario.id == id) {
          if(modificarUsuario.nombre) {
            usuario.nombre = modificarUsuario.nombre
          }
          if(modificarUsuario.edad) {
            usuario.edad = modificarUsuario.edad
          }
          if(modificarUsuario.sexo) {
            usuario.sexo = modificarUsuario.sexo
          }
          if(modificarUsuario.telefono) {
            usuario.telefono = modificarUsuario.telefono
          }
          if(modificarUsuario.direccion) {
            usuario.direccion = modificarUsuario.direccion
          }
        }
      });
      
      let json_huespedes = JSON.stringify(huespedes)
      fs.writeFileSync('src/huespedes.json', json_huespedes, 'utf-8')
      res.status(200).send('Usuario actualizado')
    } else {
      res.status(400).send("No se encuentra ningun ID")
    }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

router.put('/habitaciones/modificar/:id/:habitacion', (req, res) => {
  try {
    let id = req.params.id
    let habitacion = req.params.habitacion
    let idNuevo = req.body.id
    let modificarHabitacion = { id: idNuevo }
    console.log(modificarHabitacion)
    if (id) {
      huespedes.forEach(usuario => {
        if(usuario.id == idNuevo) {
          for (let cuarto in habitaciones) {
            if(cuarto == habitacion){
              habitaciones[cuarto].forEach((element) => {
                if (element.id == id) {
                  element.id = modificarHabitacion.id
                  let json_habitaciones = JSON.stringify(habitaciones)
                  fs.writeFileSync('src/habitaciones.json', json_habitaciones, 'utf-8')
                  res.status(200).send("Huesped actualizado")
                }
              })
            }
          }
          res.status(400).send('Habitacion no es valida')
        }
      })
    } else { res.status(400).send("ID no se encuentra") }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

router.delete('/huespedes/borrar/:id', (req, res) => {
  try {
    let id = req.params.id
    if (id) {
      huespedes = huespedes.filter(usuario => usuario.id != id)
      let json_huespedes = JSON.stringify(huespedes)
      fs.writeFileSync('src/huespedes.json', json_huespedes, 'utf-8')
      res.status(200).send('Usuario eliminado del sistema')
    } else {
      res.status(400).send("No se encuentra el ID")
    }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

router.delete('/habitaciones/borrar/:id', (req, res) => {
  try {
    let id = req.params.id
    if (id) {
      for (let cuarto in habitaciones) {
        habitaciones[cuarto] = habitaciones[cuarto].filter(usuario => usuario.id !== id)
      }
      
      let json_habitaciones = JSON.stringify(habitaciones)
      fs.writeFileSync('src/habitaciones.json', json_habitaciones, 'utf-8')
      res.status(200).send('Huesped se ha ido')
    } else {
      res.status(400).send("El ID no se encuentra")
    }
  } catch (error) {
    res.status(500).json({
      descripcion: "Error en el servidor, disculpamos los incovenientes",
      error: error.message
    })
  }
})

module.exports = router;