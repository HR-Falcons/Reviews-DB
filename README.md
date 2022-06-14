# Reviews-DB (testing)

### Testing GET /reviews

#### 100 users, .1 sleep, 30s
<img width="832" alt="Reviews 1000:s" src="https://user-images.githubusercontent.com/76196672/173707400-21f3d240-fb69-4f56-959d-35726b36f072.png">

#### 100 users, no sleep, 30s
<img width="832" alt="Reviews nosleep" src="https://user-images.githubusercontent.com/76196672/173707461-0920193d-5be6-4a60-a2b1-a03850f33b70.png">

### Testing GET /reviews/metadata

#### 100 users, .1 sleep, 30s
<img width="832" alt="Metadata 1000:s" src="https://user-images.githubusercontent.com/76196672/173707515-07a005f4-aff7-48f1-beb1-07ef17ba9317.png">

#### 100 users, no sleep, 30s
<img width="832" alt="Metadata nosleep" src="https://user-images.githubusercontent.com/76196672/173707523-f41dd7a4-a680-4bf3-af12-40f759e9097b.png">

### Conclusion
Judging by how these test went, I think my database model and queries are optimized well enough for deployment
