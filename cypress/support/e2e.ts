/// <reference types="cypress" />
/// <reference path="./index.d.ts" />


import "./commands";
import "cypress-mochawesome-reporter/register";

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("ResizeObserver") || err.message.includes("Script error")) {
    return false;
  }
  return true;
});
