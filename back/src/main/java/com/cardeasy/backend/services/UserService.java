package com.cardeasy.backend.services;

import com.cardeasy.backend.configs.SecurityConfiguration;
import com.cardeasy.backend.dtos.RecoveryJwtTokenDto;
import com.cardeasy.backend.dtos.UserDTO;
import com.cardeasy.backend.models.User;
import com.cardeasy.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    protected SecurityConfiguration securityConfiguration;
    public RecoveryJwtTokenDto authenticateUser(UserDTO userDTO) {
        // Cria um objeto de autenticação com o email e a senha do usuário
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDTO.email(), userDTO.password());

        // Autentica o usuário com as credenciais fornecidas
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        // Obtém o objeto UserDetails do usuário autenticado
        User user = (User) authentication.getPrincipal();

        // Gera um token JWT para o usuário autenticado
        return new RecoveryJwtTokenDto(jwtTokenService.generateToken(user));
    }

    public User createUser(UserDTO userDTO) {

        User newUser = User.builder()
                .name(userDTO.name())
                .email(userDTO.email())
                .password(securityConfiguration.passwordEncoder().encode(userDTO.password()))
                .sections(new ArrayList<>())
                .build();

        userRepository.save(newUser);
        return newUser;
    }

    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));
    }

    public void updateUserById(Long id, UserDTO userDTO) {
        User user = findUserById(id);
        if (userDTO.name() != null) user.setName(userDTO.name());
        if (userDTO.email() != null) user.setEmail(userDTO.email());
        if (userDTO.password() != null) user.setPassword(securityConfiguration.passwordEncoder().encode(userDTO.password()));
        userRepository.save(user);
    }

    public void deleteUserById(Long id) {
        userRepository.delete(findUserById(id));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
