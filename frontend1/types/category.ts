export type Service = {
    _id: string;
    name: string;
    icon?: string;
    categoryId: string;
    bannerImage: string;
    isPopular: boolean,
    order: Number
  };
  
  export type CategoryWithServices = {
    _id: string;
    name: string;
    services: Service[];
    isPopular: boolean
  };