import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModule: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productCreated = await this.productModule.create(createProductDto);
    return productCreated;
  }

  async findAll() {
    const productList = await this.productModule.find();
    if (!productList || productList.length == 0) {
      throw new NotFoundException('Products data not found!');
    }
    return productList;
  }

  async findOne(productId: string) {
    const existingProduct = await this.productModule.findById(productId).exec();
    if (!existingProduct) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return existingProduct;
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.productModule.findByIdAndUpdate(
      productId,
      updateProductDto,
      { new: true },
    );
    if (!existingProduct) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return existingProduct;
  }

  async remove(productId: string) {
    const deletedStudent = await this.productModule.findByIdAndRemove(
      productId,
    );
    if (!deletedStudent) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return deletedStudent;
  }
}
