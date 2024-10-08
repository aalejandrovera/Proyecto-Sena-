package com.prueba.prueba_apiN2.persistance.impl;

import com.prueba.prueba_apiN2.config.UsuarioMapper;
import com.prueba.prueba_apiN2.persistance.entities.UsuarioEntity;
import com.prueba.prueba_apiN2.persistance.impl.jpa.JPAUsuarioRepository;
import com.prueba.prueba_apiN2.services.models.UsuarioModel;
import com.prueba.prueba_apiN2.services.repositories.UsuarioRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private JPAUsuarioRepository jpaUsuarioRepository;

    public UsuarioRepositoryImpl(JPAUsuarioRepository jpaUsuarioRepository) {
        this.jpaUsuarioRepository = jpaUsuarioRepository;
    }

    @Override
    public Optional<UsuarioModel> findByUsuario(String usuario, String clave) {
        Optional<UsuarioEntity> usuarioEntity = jpaUsuarioRepository.findByUsuarioAndClave(usuario, clave);

        return usuarioEntity.isPresent() ? Optional.of(UsuarioMapper.toModel(usuarioEntity.get())) : Optional.empty();
    }
}