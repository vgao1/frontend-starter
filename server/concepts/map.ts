import { NotAllowedError } from "./errors";

export default class MapConcept {
  isValidZipCode(zipCode: string) {
    const regex = /\D/;
    const isNotANum = regex.test(zipCode);
    if (!zipCode || zipCode.length != 5 || isNotANum) {
      throw new InvalidZipCodeError(zipCode);
    }
  }
}

export class InvalidZipCodeError extends NotAllowedError {
  constructor(public readonly zipCode: string) {
    super("Invalid zipcode! Zipcode must have 5 digits (i.e. 12345)", zipCode);
  }
}
