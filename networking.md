---
layout: default
---

# Networking Glossary

- [Internet Protocol Stack](#internet-protocol-stack)
- [Network Security](#network-security)
- [Network Applications](#network-applications)
- [Transport Protocols](#transport-protocols)
- [The Data Plane](#the-data-plane)

---

## Internet Protocol Stack

__Application layer__ is where network applications transmit __messages__

- Includes protocols like HTTP (Hypertext Transfer Protocol), SMTP (Simple Mail Transfer Protocol), FTP (File Transfer Protocol)

__Transport layer__ transmits __segments__ between application endpoints

- Packet flow: matching sender/receiver packet transmission rate
- Congestion control: throttling transmission rate when network is congested
- TCP protocol operates by connections, can guarantee delivery and control packet flow and congestion
- UDP protocol is connectionless and makes no promises: no guaranteed delivery or order of arrival, no flow control, no congestion control

__Network layer__ routes __datagrams__ through the network between hosts

- The Internet Protocol defines datagram fields and how end systems and routers process datagrams
- Routing protocols determine the routes datagrams travel between hosts

__Link layer__ is responsible for delivering __frames__ across network links

- Different links use different protocols, e.g. Ethernet and WiFi

__Physical layer__ is responsible for delivering individual __bits__ across link medium

- Different mediums use different protocols, e.g. copper wire, fiber optics

## Network Security

__Denial-of-Service (DoS)__ attacks prevent users from using some network application

- Vulnerability attack: information on packets takes advantage of an application exploit
- Bandwidth flooding: so many packets are sent that congestion blocks legitimate traffic
- Connection flooding: many TCP connections are held at once, preventing new connections from being made with legitimate users

In __Distributed-Denial-of-Service (DDoS)__ attacks, multiple sources produce malicious traffic -- harder to detect and block than a single source

__Secure Sockets Layer (SSL)__ provides encryption, data integrity, authentication services on top of TCP

## Network Applications

__Client-Server Architecture__: always-on host, called a __server__, services requests from __client__ hosts

- Server IP is well-known for all clients to connect to
- No need for clients to communicate

__Peer-to-Peer (P2P) Architecture__: direct communication between clients

- Self-scaling: each peer adds service capacity
- Cost-effective: no need to maintain server infrastructure
- __BitTorrent:__
  - Collection of peers distributing a file is called a __torrent__
  - Rarest first requests: peers will request for chunks of the file that are most uncommon among their neighboring peers
  - Tit-for-tat trading: peers prioritze sending data to the neighbors that send data at higher rates
  - An additional neighbor is randomly chosen at regular intervals to receive data (so new peers may receive chunks to trade)

__Sockets__ deliver messages between appliation __processes__ and the transport layer

__IP addresses__ identify hosts, __port numbers__ identify processes on a host -- need to know both to determine where messages are sent/received

__Hypertext Transfer Protocol (HTTP)__ is an application-layer protocol for accessing web pages

- HTTP is based on TCP, uses port `80` by default
- HTTP is stateless, rerequesting the same page will resend the entire HTML document
- Method field: `GET` (request), `POST` (form input), `HEAD` (debugging), `PUT` (upload), `DELETE` (delete)
- Status codes: `200` (OK), `301` (object moved), `400` (bad request), `404` (object not found), `505` (incompatible version)

__Cookies__ consist of...

1. Cookie header line in HTTP response/request messages
2. Local file on client machine, managed by browser
3. Database entry that stores information associated with the cookie

HTTP requests may direct to a __web cache (proxy server)__ instead of origin server

- Caching requested objects reduces client response time and reduces overall web traffic
- Content Distribution Networks (CDN) install many caches to geographically localize traffic and reduce service latency
- Cluster selection strategies:
  - Geographically closest: CDN directs DNS request to the cluster closest to the requesting host
  - Better: perform period measurements of network traffic conditions to determine best cluster

__Domain Name System (DNS)__ is a distributed database mapping hostnames to IP addresses

- DNS is based on UDP, uses port `53` by default
- Supports host aliasing, e.g. `enterprise.com` instead of `relay1.west-coast.enterprise.com`
- Load distributing: DNS may distribute traffic for a single hostname among a set of replicated server IP addresses
- DNS hierarchy: root servers >> top-level domain servers >> authoritative servers
  - Top-level domains include `.org`, `.com`, etc.
  - Authortative servers contain direct hostname-IP mappings
- DNS queries are directed to local DNS servers (usually set up by ISP) which serve as a proxy for walking the DNS hierarchy
- DDoS bandwidth-flooding attack: overwhelming DNS servers with packets to prevent legitimate queries from being serviced

## Transport Protocols

- Demultiplexing: delivering ingress segments to the correct socket/process
- Multiplexing: gathering data from different sockets and serializing egress segments
- Source and destination port fields are 16 bits (range [0, 65535], but ports [0, 1023] are reserved)

## Network Addressing

An __IP address__ is 4 bytes long, looks like `127.0.0.1` (each period-separated number is in the range [0, 255])

---

## References

- [Computer Networking: A Top-Down Approach](https://www.amazon.com/Computer-Networking-Top-Down-Approach-7th/dp/0133594149)
