import prisma from "../db/prisma";

class User {
  private email: string;
  private customerid: string;
  constructor(email: string, customerid: string) {
    this.email = email;
    this.customerid = customerid;
  }

  async saveUser() {
    const obj = await prisma.user.findUnique({ where: { email: this.email } });
    if (obj == null) {
      await prisma.user.create({
        data: { email: this.email, customerid: this.customerid },
      });
    } else {
      await prisma.user.update({
        where: { email: this.email },
        data: { customerid: this.customerid },
      });
    }
  }

  async hasUserAccessForm() {
    const obj = await prisma.user.findUnique({ where: { email: this.email } });
    if (obj == null) {
      throw new Error();
    }
    return obj.isUserAccessForm;
  }

  async makeUserAccessForm() {
    await prisma.user.update({
      where: { email: this.email },
      data: { isUserAccessForm: true },
    });
  }

  async resetFormAccess() {
    await prisma.user.update({
      where: { email: this.email },
      data: { isUserAccessForm: false },
    });
  }
}

export default User;
