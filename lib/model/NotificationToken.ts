import crypto from "crypto";

import prisma from "../db/prisma";

class NotificationToken {
  private readonly token: string;
  private constructor(token: string) {
    this.token = token;
  }

  public static generateToken() {
    return new NotificationToken(crypto.randomBytes(32).toString("hex"));
  }

  public static of(token: string) {
    return new NotificationToken(token);
  }

  async saveToken(email: string, expiration: Date) {
    const obj = await prisma.notificationToken.findUnique({
      where: { email: email },
    });
    if (obj == null) {
      await prisma.notificationToken.create({
        data: {
          email: email,
          notificationexpiration: expiration,
          notificationtoken: this.token,
        },
      });
    } else {
      await prisma.notificationToken.update({
        where: { email: email },
        data: {
          notificationexpiration: expiration,
          notificationtoken: this.token,
        },
      });
    }
  }

  async getUser() {
    const notificatioObj = await prisma.notificationToken.findUnique({
      where: { notificationtoken: this.token },
    });
    if (
      notificatioObj == null ||
      notificatioObj.notificationexpiration < new Date(Date.now())
    )
      return null;
    const email = notificatioObj.email;
    const userObj = await prisma.user.findUnique({ where: { email: email } });
    return userObj;
  }

  async invalidateToken() {
    return await prisma.notificationToken.delete({
      where: { notificationtoken: this.token },
    });
  }

  toString() {
    return this.token;
  }
}

export default NotificationToken;
