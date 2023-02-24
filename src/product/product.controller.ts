import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

// @ApiBearerAuth()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Res() response, @Body() createProductDto: CreateProductDto) {
    try {
      const newProduct = await this.productService.create(createProductDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Product has been created successfully',
        newProduct,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Product not created!',
        error: 'Bad Request',
      });
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Res() response) {
    try {
      const productData = await this.productService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All Product data found successfully',
        productData: productData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string) {
    try {
      const existingProduct = await this.productService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: 'Product found successfully',
        existingProduct,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Put(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const existingProduct = await this.productService.update(
        id,
        updateProductDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Product has been successfully updated',
        existingProduct,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedProduct = await this.productService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: 'Product deleted successfully',
        deletedProduct,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
