package com.gift.maddie.domain;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Poke.
 */
@Entity
@Table(name = "poke_table")
public class Poke implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "heart_time")
    private String heartTime;

    @Column(name = "mail_time")
    private String mailTime;

    @Column(name = "massage_time")
    private String vacaTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeartTime() {
        return heartTime;
    }

    public Poke heartTime(String heartTime) {
        this.heartTime = heartTime;
        return this;
    }

    public void setHeartTime(String heartTime) {
        this.heartTime = heartTime;
    }

    public String getMailTime() {
        return mailTime;
    }

    public Poke mailTime(String mailTime) {
        this.mailTime = mailTime;
        return this;
    }

    public void setMailTime(String mailTime) {
        this.mailTime = mailTime;
    }

    public String getVacaTime() {
        return vacaTime;
    }

    public Poke vacaTime(String vacaTime) {
        this.vacaTime = vacaTime;
        return this;
    }

    public void setVacaTime(String vacaTime) {
        this.vacaTime = vacaTime;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Poke)) {
            return false;
        }
        return id != null && id.equals(((Poke) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Poke{" +
            "id=" + getId() +
            ", heartTime='" + getHeartTime() + "'" +
            ", mailTime='" + getMailTime() + "'" +
            ", vacaTime='" + getVacaTime() + "'" +
            "}";
    }
}
