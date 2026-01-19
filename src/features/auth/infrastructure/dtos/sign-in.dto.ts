import { IsNotEmpty, IsString } from "class-validator";
import SignInRequest from "../../domain/types/sign-in-request.type";

export default class SignInDto implements SignInRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
