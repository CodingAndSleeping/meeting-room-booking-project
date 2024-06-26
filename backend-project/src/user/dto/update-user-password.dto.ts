import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({
    message: '密码不能为空！',
  })
  @MinLength(6, {
    message: '密码长度不能少于6位！',
  })
  password: string;

  @IsNotEmpty({
    message: '确认密码不能为空！',
  })
  @IsEmail(
    {},
    {
      message: '请输入正确的邮箱格式！',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空！',
  })
  captcha: string;
}
