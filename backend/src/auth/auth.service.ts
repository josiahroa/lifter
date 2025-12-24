import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  requestOTPCode(body: any): { success: boolean; message: string } {
    console.log(body);
    return {
      success: true,
      message: "OTP code requested",
    };
  }

  confirmOTPCode(body: any): { success: boolean; message: string } {
    console.log(body);
    return {
      success: true,
      message: "OTP code confirmed",
    };
  }
}
