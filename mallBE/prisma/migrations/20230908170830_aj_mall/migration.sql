-- CreateTable
CREATE TABLE "authModel" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "avatar" TEXT,
    "avatarID" TEXT,
    "role" TEXT,
    "roleID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatcherModel" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL,
    "roleID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product" TEXT NOT NULL,
    "productID" TEXT,

    CONSTRAINT "dispatcherModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageID" TEXT,
    "brand" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "productModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authModel_email_key" ON "authModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "authModel_avatarID_key" ON "authModel"("avatarID");

-- CreateIndex
CREATE UNIQUE INDEX "authModel_roleID_key" ON "authModel"("roleID");

-- CreateIndex
CREATE UNIQUE INDEX "dispatcherModel_email_key" ON "dispatcherModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dispatcherModel_roleID_key" ON "dispatcherModel"("roleID");

-- CreateIndex
CREATE UNIQUE INDEX "dispatcherModel_productID_key" ON "dispatcherModel"("productID");

-- AddForeignKey
ALTER TABLE "productModel" ADD CONSTRAINT "productModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
