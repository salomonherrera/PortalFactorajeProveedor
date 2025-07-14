FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TekProvider.Auth/TekProvider.Auth.csproj", "TekProvider.Auth/"]
COPY ["TekProvider.Shared/TekProvider.Shared.csproj", "TekProvider.Shared/"]
RUN dotnet restore "TekProvider.Auth/TekProvider.Auth.csproj"
COPY . .
WORKDIR "/src/TekProvider.Auth"
RUN dotnet build "TekProvider.Auth.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TekProvider.Auth.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TekProvider.Auth.dll"]