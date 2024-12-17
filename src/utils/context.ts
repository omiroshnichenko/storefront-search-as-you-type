/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {
    SearchBucket,
    SearchFacet,
    SearchFilter,
    SearchInputUnit,
    SearchResultProduct,
    SearchResultSuggestion,
    SearchResultUnit,
} from "@adobe/magento-storefront-events-sdk/dist/types/types/schemas";

import { ProductSearchResponse } from "../types/interface";

const updateSearchInputCtx = (
    searchUnitId: string,
    searchRequestId: string,
    phrase: string,
    filters: Array<SearchFilter>,
    pageSize: number,
): void => {
    window.adobeDataLayer.push((dl: any) => {
        const searchInputCtx = dl.getState("searchInputContext") ?? {
            units: [],
        };

        // create search input unit
        const searchInputUnit: SearchInputUnit = {
            searchUnitId,
            searchRequestId,
            queryTypes: ["products", "suggestions"],
            phrase,
            pageSize,
            currentPage: 1,
            filter: filters,
            sort: [],
        };

        // find search input unit index
        const searchInputUnitIndex = searchInputCtx?.units?.findIndex(
            (unit: any) => unit?.searchUnitId === searchUnitId,
        );

        // update search input unit
        if (searchInputUnitIndex === undefined || searchInputUnitIndex < 0) {
            searchInputCtx.units.push(searchInputUnit);
        } else {
            searchInputCtx.units[searchInputUnitIndex] = searchInputUnit;
        }

        dl.push({ searchInputContext: searchInputCtx });
    });
};

const updateSearchResultsCtx = (
    searchUnitId: string,
    searchRequestId: string,
    results: ProductSearchResponse["data"]["productSearch"],
): void => {
    window.adobeDataLayer.push((dl: any) => {
        const searchResultsCtx = dl.getState("searchResultsContext") ?? {
            units: [],
        };

        // find search result unit index
        const searchResultUnitIndex = searchResultsCtx?.units?.findIndex(
            (unit: any) => unit?.searchUnitId === searchUnitId,
        );

        // create search result unit
        const searchResultUnit: SearchResultUnit = {
            searchUnitId,
            searchRequestId,
            products: createProducts(results?.items),
            categories: [],
            suggestions: createSuggestions(results?.suggestions),
            // TODO: default values may be invalid
            page: results?.page_info?.current_page || 1,
            perPage: results?.page_info?.page_size || 6,
            facets: createFacets(results?.facets),
        };

        // update search result unit
        if (searchResultUnitIndex === undefined || searchResultUnitIndex < 0) {
            searchResultsCtx.units.push(searchResultUnit);
        } else {
            searchResultsCtx.units[searchResultUnitIndex] = searchResultUnit;
        }

        dl.push({ searchResultsContext: searchResultsCtx });
    });
};

const createProducts = (
    items: ProductSearchResponse["data"]["productSearch"]["items"],
): SearchResultProduct[] => {
    if (!items) {
        return [];
    }

    return items.map((item, index) => ({
        name: item.productView.name,
        sku: item.productView.sku,
        // TODO: what is the default value?
        url: item.productView.url ?? "",
        imageUrl: item.productView?.images && item.productView.images[0] && item.productView.images[0].url || '',
        price: item.productView?.price?.final?.amount?.value || item.productView?.priceRange?.minimum?.final?.amount?.value,
        rank: index,
    }));
};

const createSuggestions = (
    items: ProductSearchResponse["data"]["productSearch"]["suggestions"],
): SearchResultSuggestion[] => {
    if (!items) {
        return [];
    }

    const suggestions: SearchResultSuggestion[] = items.map(
        (suggestion, index) => ({
            suggestion: suggestion,
            rank: index,
        }),
    );

    return suggestions;
};

const createFacets = (
    items: ProductSearchResponse["data"]["productSearch"]["facets"],
): SearchFacet[] => {
    if (!items) {
        return [];
    }

    const facets = items.map<SearchFacet>(item => ({
        attribute: item.attribute,
        title: item.title,
        // TODO: what is the default value?
        type: item.type || "PINNED",
        buckets: item.buckets.map<SearchBucket>(bucket => bucket),
    }));

    return facets;
};

export { updateSearchInputCtx, updateSearchResultsCtx };
