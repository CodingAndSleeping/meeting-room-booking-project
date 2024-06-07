import { JwtService } from '@nestjs/jwt';

export function generateToken(
  user: any,
  jwtService: JwtService,
  accessTokenExpiresTime?: string | number,
  refreshTokenExpiresTime?: string | number,
) {
  // 生成access_token
  const accessToken = jwtService.sign(
    {
      userId: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions,
    },
    {
      expiresIn: accessTokenExpiresTime || '30m',
    },
  );
  // 生成refresh_token
  const refreshToken = jwtService.sign(
    {
      userId: user.id,
    },
    {
      expiresIn: refreshTokenExpiresTime || '7d',
    },
  );

  return {
    accessToken,
    refreshToken,
  };
}
