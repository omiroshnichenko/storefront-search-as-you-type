/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const Product = `
    fragment Product on ProductSearchItem {
        product {
            __typename
            sku
            name
            canonical_url
            small_image {
                url
            }
            image {
                url
            }
            thumbnail {
                url
            }
            price_range {
                minimum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
                maximum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
            }
        }
    }
`;

const ProductView = `
    fragment ProductView on ProductSearchItem {
        productView {
            __typename
            sku
            name
            url
            urlKey
            images {
                label
                url
                roles
            }
            
            ... on ComplexProductView {
                priceRange {
                    maximum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                    minimum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                }
                options {
                    id
                    title
                    values {
                        title
                        ... on ProductViewOptionValueSwatch {
                            id
                            inStock
                            type
                            value
                        }
                    }
                }
            }
            ... on SimpleProductView {
                price {
                    final {
                        amount {
                            value
                            currency
                        }
                    }
                    regular {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
        }
    }
`;

export { Product, ProductView };
