```
const query = queryClientSupport(
 	['customerData', 'profile'],
 	null,
 	configData.BACKEND_URL,
 	apiPath,
 	'GET',
 	headers
 );
);
```

Cannot at this point use React Query to cache and manage results form server DB requests. In the context of passing the queryClient reference to router loader and action methods, the invalidateQueries method fires but does not invalidate query. As a result, on logout of customer A then login of customer B, customer B see customer A's information.

```

queryClient.invalidateQueries({ queryKey: ['customerData'] });

try {
 const responseData: CustomerCreatedData =
 	queryClient.getQueryData(query.queryKey) ??
 	(await queryClient.fetchQuery(query));

    // more code
} catch (err) {
    console.error(`error occurred with ${apiPath} - ${err}`);
}
```
