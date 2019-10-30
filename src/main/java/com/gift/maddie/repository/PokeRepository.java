package com.gift.maddie.repository;
import com.gift.maddie.domain.Poke;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Poke entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PokeRepository extends JpaRepository<Poke, Long> {

}
