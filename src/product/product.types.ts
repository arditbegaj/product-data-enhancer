export type Product = {
    productId: string;
    docId: string;
    name: string;
    type: string;
    shortDescription: string;
    description: string;
    categoryName: string;
    vendorId: string;
    manufacturerId: string;
    storefrontPriceVisibility: string;
    variants: Variant[];
    options: Option[];
    status: string;
};

export type Variant = {
    id: string;
    available: boolean;
    attributes: Record<string, any>;
    cost: number;
    currency: string;
    description: string;
    packaging: string;
    price: number;
    sku: string;
    active: boolean;
    images: Image[];
};

export type Option = {
    name: string;
    values: OptionValue[];
    id: string;
    dataField: any | null;
};

export type OptionValue = {
    id: string;
    name: string;
    value: string;
};

export type Image = {
    fileName: string;
    cdnLink: string;
    i: number;
    alt: string | null;
};
