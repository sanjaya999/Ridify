package com.renting.RentThis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PaymentSuccessFailure {

    @GetMapping("/payment-success")
    public String paymentSuccess(@RequestParam("ref") String reference, Model model) {
        model.addAttribute("reference", reference);
        return "payment-success";
    }

    @GetMapping("/payment-canceled")
    public String paymentCanceled() {
        return "payment-canceled";
    }

    @GetMapping("/payment-expired")
    public String paymentExpired() {
        return "payment-expired";
    }

    @GetMapping("/payment-error")
    public String paymentError(@RequestParam("message") String message, Model model) {
        model.addAttribute("errorMessage", message);
        return "payment-error";
    }

    @GetMapping("/payment-pending")
    public String paymentPending(@RequestParam("status") String status, Model model) {
        model.addAttribute("status", status);
        return "payment-pending";
    }
}