package com.renting.RentThis.service;

import com.renting.RentThis.entity.User;
import com.renting.RentThis.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads the user details based on the provided email address.
     * This method is used to retrieve user authentication information,
     * including email, password, and role, by querying the user repository.
     *
     * @param email the email address of the user to be loaded
     * @return a {@code UserDetails} object containing the user's email, password, and role-based authority
     * @throws UsernameNotFoundException if no user is found with the specified email
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("No user found with email" + email ));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );    }
}
