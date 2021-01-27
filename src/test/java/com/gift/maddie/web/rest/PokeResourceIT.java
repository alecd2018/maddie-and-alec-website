package com.gift.maddie.web.rest;

import com.gift.maddie.AlecApp;
import com.gift.maddie.domain.Poke;
import com.gift.maddie.repository.PokeRepository;
import com.gift.maddie.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.gift.maddie.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gift.maddie.service.MailService;

/**
 * Integration tests for the {@link PokeResource} REST controller.
 */
@SpringBootTest(classes = AlecApp.class)
public class PokeResourceIT {

    private static final String DEFAULT_HEART_TIME = "AAAAAAAAAA";
    private static final String UPDATED_HEART_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_MAIL_TIME = "AAAAAAAAAA";
    private static final String UPDATED_MAIL_TIME = "BBBBBBBBBB";

    private static final String DEFAULT_VACA_TIME = "AAAAAAAAAA";
    private static final String UPDATED_VACA_TIME = "BBBBBBBBBB";

    @Autowired
    private PokeRepository pokeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    @Autowired
    private MailService mailService;

    private MockMvc restPokeMockMvc;

    private Poke poke;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PokeResource pokeResource = new PokeResource(pokeRepository, mailService);
        this.restPokeMockMvc = MockMvcBuilders.standaloneSetup(pokeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poke createEntity(EntityManager em) {
        Poke poke = new Poke()
            .heartTime(DEFAULT_HEART_TIME)
            .mailTime(DEFAULT_MAIL_TIME)
            .vacaTime(DEFAULT_VACA_TIME);
        return poke;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Poke createUpdatedEntity(EntityManager em) {
        Poke poke = new Poke()
            .heartTime(UPDATED_HEART_TIME)
            .mailTime(UPDATED_MAIL_TIME)
            .vacaTime(UPDATED_VACA_TIME);
        return poke;
    }

    @BeforeEach
    public void initTest() {
        poke = createEntity(em);
    }

    @Test
    @Transactional
    public void createPoke() throws Exception {
        int databaseSizeBeforeCreate = pokeRepository.findAll().size();

        // Create the Poke
        restPokeMockMvc.perform(post("/api/pokes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(poke)))
            .andExpect(status().isCreated());

        // Validate the Poke in the database
        List<Poke> pokeList = pokeRepository.findAll();
        assertThat(pokeList).hasSize(databaseSizeBeforeCreate + 1);
        Poke testPoke = pokeList.get(pokeList.size() - 1);
        assertThat(testPoke.getHeartTime()).isEqualTo(DEFAULT_HEART_TIME);
        assertThat(testPoke.getMailTime()).isEqualTo(DEFAULT_MAIL_TIME);
        assertThat(testPoke.getVacaTime()).isEqualTo(DEFAULT_VACA_TIME);
    }

    @Test
    @Transactional
    public void createPokeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pokeRepository.findAll().size();

        // Create the Poke with an existing ID
        poke.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPokeMockMvc.perform(post("/api/pokes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(poke)))
            .andExpect(status().isBadRequest());

        // Validate the Poke in the database
        List<Poke> pokeList = pokeRepository.findAll();
        assertThat(pokeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPokes() throws Exception {
        // Initialize the database
        pokeRepository.saveAndFlush(poke);

        // Get all the pokeList
        restPokeMockMvc.perform(get("/api/pokes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(poke.getId().intValue())))
            .andExpect(jsonPath("$.[*].heartTime").value(hasItem(DEFAULT_HEART_TIME.toString())))
            .andExpect(jsonPath("$.[*].mailTime").value(hasItem(DEFAULT_MAIL_TIME.toString())))
            .andExpect(jsonPath("$.[*].vacaTime").value(hasItem(DEFAULT_VACA_TIME.toString())));
    }
    
    @Test
    @Transactional
    public void getPoke() throws Exception {
        // Initialize the database
        pokeRepository.saveAndFlush(poke);

        // Get the poke
        restPokeMockMvc.perform(get("/api/pokes/{id}", poke.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(poke.getId().intValue()))
            .andExpect(jsonPath("$.heartTime").value(DEFAULT_HEART_TIME.toString()))
            .andExpect(jsonPath("$.mailTime").value(DEFAULT_MAIL_TIME.toString()))
            .andExpect(jsonPath("$.vacaTime").value(DEFAULT_VACA_TIME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPoke() throws Exception {
        // Get the poke
        restPokeMockMvc.perform(get("/api/pokes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePoke() throws Exception {
        // Initialize the database
        pokeRepository.saveAndFlush(poke);

        int databaseSizeBeforeUpdate = pokeRepository.findAll().size();

        // Update the poke
        Poke updatedPoke = pokeRepository.findById(poke.getId()).get();
        // Disconnect from session so that the updates on updatedPoke are not directly saved in db
        em.detach(updatedPoke);
        updatedPoke
            .heartTime(UPDATED_HEART_TIME)
            .mailTime(UPDATED_MAIL_TIME)
            .vacaTime(UPDATED_VACA_TIME);

        restPokeMockMvc.perform(put("/api/pokes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPoke)))
            .andExpect(status().isOk());

        // Validate the Poke in the database
        List<Poke> pokeList = pokeRepository.findAll();
        assertThat(pokeList).hasSize(databaseSizeBeforeUpdate);
        Poke testPoke = pokeList.get(pokeList.size() - 1);
        assertThat(testPoke.getHeartTime()).isEqualTo(UPDATED_HEART_TIME);
        assertThat(testPoke.getMailTime()).isEqualTo(UPDATED_MAIL_TIME);
        assertThat(testPoke.getVacaTime()).isEqualTo(UPDATED_VACA_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingPoke() throws Exception {
        int databaseSizeBeforeUpdate = pokeRepository.findAll().size();

        // Create the Poke

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPokeMockMvc.perform(put("/api/pokes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(poke)))
            .andExpect(status().isBadRequest());

        // Validate the Poke in the database
        List<Poke> pokeList = pokeRepository.findAll();
        assertThat(pokeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePoke() throws Exception {
        // Initialize the database
        pokeRepository.saveAndFlush(poke);

        int databaseSizeBeforeDelete = pokeRepository.findAll().size();

        // Delete the poke
        restPokeMockMvc.perform(delete("/api/pokes/{id}", poke.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Poke> pokeList = pokeRepository.findAll();
        assertThat(pokeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Poke.class);
        Poke poke1 = new Poke();
        poke1.setId(1L);
        Poke poke2 = new Poke();
        poke2.setId(poke1.getId());
        assertThat(poke1).isEqualTo(poke2);
        poke2.setId(2L);
        assertThat(poke1).isNotEqualTo(poke2);
        poke1.setId(null);
        assertThat(poke1).isNotEqualTo(poke2);
    }
}
