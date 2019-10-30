package com.gift.maddie.web.rest;

import com.gift.maddie.domain.Poke;
import com.gift.maddie.repository.PokeRepository;
import com.gift.maddie.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.gift.maddie.domain.Poke}.
 */
@RestController
@RequestMapping("/api")
public class PokeResource {

    private final Logger log = LoggerFactory.getLogger(PokeResource.class);

    private static final String ENTITY_NAME = "poke";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PokeRepository pokeRepository;

    public PokeResource(PokeRepository pokeRepository) {
        this.pokeRepository = pokeRepository;
    }

    /**
     * {@code POST  /pokes} : Create a new poke.
     *
     * @param poke the poke to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new poke, or with status {@code 400 (Bad Request)} if the poke has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pokes")
    public ResponseEntity<Poke> createPoke(@RequestBody Poke poke) throws URISyntaxException {
        log.debug("REST request to save Poke : {}", poke);
        if (poke.getId() != null) {
            throw new BadRequestAlertException("A new poke cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Poke result = pokeRepository.save(poke);
        return ResponseEntity.created(new URI("/api/pokes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pokes} : Updates an existing poke.
     *
     * @param poke the poke to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated poke,
     * or with status {@code 400 (Bad Request)} if the poke is not valid,
     * or with status {@code 500 (Internal Server Error)} if the poke couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pokes")
    public ResponseEntity<Poke> updatePoke(@RequestBody Poke poke) throws URISyntaxException {
        log.debug("REST request to update Poke : {}", poke);
        if (poke.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Poke result = pokeRepository.save(poke);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, poke.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /pokes} : get all the pokes.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pokes in body.
     */
    @GetMapping("/pokes")
    public List<Poke> getAllPokes() {
        log.debug("REST request to get all Pokes");
        return pokeRepository.findAll();
    }

    /**
     * {@code GET  /pokes/:id} : get the "id" poke.
     *
     * @param id the id of the poke to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the poke, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pokes/{id}")
    public ResponseEntity<Poke> getPoke(@PathVariable Long id) {
        log.debug("REST request to get Poke : {}", id);
        Optional<Poke> poke = pokeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(poke);
    }

    /**
     * {@code DELETE  /pokes/:id} : delete the "id" poke.
     *
     * @param id the id of the poke to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pokes/{id}")
    public ResponseEntity<Void> deletePoke(@PathVariable Long id) {
        log.debug("REST request to delete Poke : {}", id);
        pokeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
