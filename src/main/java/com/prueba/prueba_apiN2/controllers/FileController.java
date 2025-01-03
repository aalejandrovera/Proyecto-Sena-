package com.prueba.prueba_apiN2.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class FileController {

    @GetMapping("/uploads/productos/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        //La ruta la debe tomar segun el directorio donde se aloje el proyecto, para que se lea desde cualquier pc sin problema.
        String basePath = System.getProperty("user.dir") + "/uploads/productos";
        File directorio = new File(basePath);
        Path filePath = Paths.get(basePath).resolve(filename);
        Resource file = new UrlResource(filePath.toUri());

        if (!directorio.exists()) {
            //Si no existen las carpetas, se crean para que pueda guardar y leer las imagenes.
            if (directorio.mkdirs()) {
                System.out.println("Las carpetas se han creado: " + basePath);
            } else {
                System.out.println("No se pudieron crear las carpetas: " + basePath);
            }
        }

        if (file.exists() && file.isReadable()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } else {
            throw new RuntimeException("No se puede leer el archivo: " + filename);
        }
    }
}
