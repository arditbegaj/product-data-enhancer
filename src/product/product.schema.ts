import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'non-inventory' })
  type: string;

  @Prop()
  shortDescription: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  categoryName: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  manufacturerId: Types.ObjectId;

  @Prop({ default: 'members-only' })
  storefrontPriceVisibility: string;

  @Prop([{
    id: String,
    available: Boolean,
    attributes: Object,
    cost: Number,
    currency: String,
    description: String,
    packaging: String,
    price: Number,
    sku: String,
    active: Boolean,
    images: [{
      fileName: String,
      cdnLink: String,
      alt: String
    }]
  }])
  variants: any[];

  @Prop([{
    name: String,
    values: [{
      id: String,
      name: String,
      value: String
    }],
    id: String,
    dataField: String
  }])
  options: any[];

  @Prop({ default: 'active' })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);


export type VendorDocument = Vendor & Document;

@Schema()
export class Vendor {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  contactEmail: string;

  @Prop()
  contactPhone: string;

  @Prop({ default: 'active' })
  status: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
