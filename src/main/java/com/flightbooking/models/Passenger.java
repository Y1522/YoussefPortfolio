package com.flightbooking.models;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Represents a passenger traveling on a booked flight.
 */
public class Passenger implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int id;
    private int bookingId;
    private String firstName;
    private String lastName;
    private String passportNumber;
    private LocalDate dateOfBirth;
    private String nationality;
    private String gender;
    private String seatNumber;
    private boolean specialAssistance;
    private String specialMealRequest;
    
    public Passenger() {
    }
    
    public Passenger(int id, int bookingId, String firstName, String lastName, String passportNumber,
                    LocalDate dateOfBirth, String nationality, String gender, String seatNumber,
                    boolean specialAssistance, String specialMealRequest) {
        this.id = id;
        this.bookingId = bookingId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.passportNumber = passportNumber;
        this.dateOfBirth = dateOfBirth;
        this.nationality = nationality;
        this.gender = gender;
        this.seatNumber = seatNumber;
        this.specialAssistance = specialAssistance;
        this.specialMealRequest = specialMealRequest;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public int getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public String getPassportNumber() {
        return passportNumber;
    }
    
    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getNationality() {
        return nationality;
    }
    
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getSeatNumber() {
        return seatNumber;
    }
    
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
    
    public boolean isSpecialAssistance() {
        return specialAssistance;
    }
    
    public void setSpecialAssistance(boolean specialAssistance) {
        this.specialAssistance = specialAssistance;
    }
    
    public String getSpecialMealRequest() {
        return specialMealRequest;
    }
    
    public void setSpecialMealRequest(String specialMealRequest) {
        this.specialMealRequest = specialMealRequest;
    }
    
    @Override
    public String toString() {
        return "Passenger{" +
                "id=" + id +
                ", bookingId=" + bookingId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", passportNumber='" + passportNumber + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", nationality='" + nationality + '\'' +
                ", gender='" + gender + '\'' +
                ", seatNumber='" + seatNumber + '\'' +
                ", specialAssistance=" + specialAssistance +
                ", specialMealRequest='" + specialMealRequest + '\'' +
                '}';
    }
}